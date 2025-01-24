/* RMIT University Vietnam
   Course: COSC2767 Systems Deployment and Operations
   Semester: 2024C
   Assessment: Assignment 2
   Author: TEAM NEWBIE
   ID:  
   Nguyen Minh Quan - S3927181
   Nguyen Nghia Hiep - S3978270
   Nguyen Le Thu Nhan - S3932151
   Nguyen Phuoc Nhu Phuc - S3819660

   Created  date: 3rd Jan 2024
   Last modified: 16th Jan 2024
*/

pipeline {
    agent any

    tools {
        nodejs "NodeJS"
        jdk "JDK 17"
    }

    // identify environment variables
    environment {
        APP_NAME = "rmit-store"
        RELEASE = "1.0.0"
        DOCKER_USER = "nhan2102"
        DOCKER_CREDENTIALS = "dockerhub"
        ANSIBLE_CREDENTIALS = "ansible"
        GIT_CREDENTIALS = "github"

        IMAGE_NAME_DEV = "${DOCKER_USER}/${APP_NAME}"      
        IMAGE_NAME_PROD = "${DOCKER_USER}/prod-${APP_NAME}"      
        IMAGE_TAG = "${RELEASE}-${env.BUILD_NUMBER}"

        SERVICE_NAME = "${APP_NAME}-service"

        PLAYBOOK_FILENAME = "PullAndTest.yml"

        DOCKERFILE_DEV = "prod.Dockerfile"
        DOCKERFILE_PROD = "prod.Dockerfile"

        AWS_REGION = "us-east-1"
        SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:633673492928:email-topic"

        VPC_CIDR = '10.0.0.0/16'
        PUBLIC_SUBNET1_CIDR = '10.0.1.0/24'
        PUBLIC_SUBNET2_CIDR = '10.0.2.0/24'

        REPO_URL = "https://github.com/RMIT-Vietnam-Teaching/cosc2767-assignment-2-group-2024c-newbie-team.git"
        GIT_BRANCH = "main"
        KEY_NAME = "devops_project_key"
        VPC_ID_DEV = "vpc-0b042585e9ec719f9"
        SUBNET_ID_DEV = "subnet-08996f374a5237f33"
        ELASTIC_ID_DEV = "eipalloc-0352959bcb4bfe70d"
        ELASTIC_IP_DEV = "23.20.223.181"
        IMAGE_ID_FRONTEND = "ami-05576a079321f21f8"
        IMAGE_ID_BACKEND = "ami-05576a079321f21f8"
        TRUSTED_SSH_CIDR = "0.0.0.0/0" // CIDR block for SSH access to EC2 instances
        HOSTNAME_FE = "worker-client"
        HOSTNAME_BE = "worker-server" 
        DEV_STACK_NAME = "DevEnv"
        PROD_STACK_NAME = "ProdEnv"
    }

    stages {
        stage("Clean Workspace") {
            steps {
                cleanWs()
                sh '''
                    docker system prune -f
                    if [ $(docker ps -aq | wc -l) -gt 0 ]; then
                        docker rm -vf $(docker ps -aq)
                    fi
                    if [ $(docker images -aq | wc -l) -gt 0 ]; then
                        docker rmi -f $(docker images -aq)
                    fi
                '''
                sh '''
                    truncate -s 0 /var/lib/jenkins/.ssh/known_hosts
                '''
            }
        }

        // checkout code from source code
        stage("Checkout from SCM") {
            steps {
                git branch: "${GIT_BRANCH}",
                    url: "${REPO_URL}",
                    credentialsId: "${GIT_CREDENTIALS}" // Replace this with your credentials ID
            }
        }

        
        stage("Unit Test") {
            steps {
                script {
                    sh """
                        echo "Start unit test"
                        npm install
                        npx jest unit

                        echo "Test Result: Unit Test Passed"
                    """
                }
            }
        }

        // create Docker image -> push to Docker Hub -> pull back to build image
        stage("Build & Push Docker images for Development Environment") {
            steps {
                script {
                    parallel(
                        "Client": {
                            dir('client') {
                                docker.withRegistry('', DOCKER_CREDENTIALS) {
                                def clientImage = docker.build("${IMAGE_NAME_DEV}-client")
                                clientImage.push("${IMAGE_TAG}")
                                clientImage.push("latest")
                                }
                            }
                        },
                        "Server": {
                            dir('server') {
                                docker.withRegistry('', DOCKER_CREDENTIALS) {
                                def serverImage = docker.build("${IMAGE_NAME_DEV}-server")
                                serverImage.push("${IMAGE_TAG}")
                                serverImage.push("latest")
                                }
                            }
                        }
                    )
                }
            }
        }

        stage('CloudFormation Deploy Development Stack') {
            steps {
                dir('cloudformation') {
                    script {
                        // test
                        echo "AWS Region: ${env.AWS_REGION}"

                        def ssh_pub_key = sh(script: '''
                            sudo cat /home/ansibleadmin/.ssh/id_rsa.pub
                        ''', returnStdout: true).trim()

                        // Create the stack
                            sh """
                                aws cloudformation deploy \
                                    --template-file dev-env.yml \
                                    --stack-name ${DEV_STACK_NAME} \
                                    --capabilities CAPABILITY_IAM \
                                    --parameter-overrides \
                                        KeyName=${env.KEY_NAME} \
                                        VpcId=${env.VPC_ID_DEV} \
                                        SubnetId=${env.SUBNET_ID_DEV} \
                                        SshPubKey='${ssh_pub_key}' \
                                        ElasticId=${env.ELASTIC_ID_DEV}
                            """

                        // Wait for the stack to be created
                        sh """
                            aws cloudformation wait stack-create-complete \
                                --stack-name ${DEV_STACK_NAME}
                        """

                        sleep(time: 10, unit: 'SECONDS')
                    }
                }
            }
        }

        stage("Ping Remote Server") {
            steps {
                script {
                    sh """
                        chmod +x ansible/playbooks/PullAndTest.yml
                        ssh-keyscan ${ELASTIC_IP_DEV} >> /var/lib/jenkins/.ssh/known_hosts
                    """
                    ansiblePlaybook becomeUser: 'ansibleadmin',
                                    credentialsId: "${env.ANSIBLE_CREDENTIALS}", 
                                    installation: 'Ansible', 
                                    inventory: 'ansible/hosts', 
                                    playbook: "ansible/playbooks/PingAll.yml"
                }
            }
        }
        
        stage("Deploy Dev Server") {
            steps {
                script {
                    // Run the Ansible playbook
                    ansiblePlaybook becomeUser: 'ansibleadmin', 
                                    credentialsId: "${env.ANSIBLE_CREDENTIALS}", 
                                    installation: 'Ansible', 
                                    inventory: 'ansible/hosts', 
                                    playbook: "ansible/playbooks/${PLAYBOOK_FILENAME}"
                }
            }
        }

        stage("Run Integration Test on Remote Server") {
            steps {
                script {
                    sh """
                        npm install
                        npx jest integration
                    """
                }
            }
        }

        stage("Run Web UI Test on Remote Server") {
            steps {
                script {
                    sh """
                        sudo dnf install -y xorg-x11-server-Xvfb gtk3-devel nss alsa-lib
                        npx cypress run

                        echo "Test Result: Web UI Test Passed"
                    """
                }
            }
        }

        stage('CloudFormation Deploy Production Stack') {
            steps {
                script {
                    def SWARM_MASTER_TOKEN = sh(script: "docker swarm join-token worker -q", returnStdout: true).trim()
                    def SWARM_MASTER_IP = sh(script: "hostname -I | awk '{print \$1}'", returnStdout: true).trim()

                    // Deploy or update the CloudFormation stack
                    sh """
                        aws cloudformation deploy \
                            --template-file cloudformation/prod-env.yml \
                            --stack-name ${env.PROD_STACK_NAME} \
                            --region ${env.AWS_REGION} \
                            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
                            --parameter-overrides \
                                KeyName=${env.KEY_NAME} \
                                ImageIdFrontEnd=${env.IMAGE_ID_FRONTEND} \
                                ImageIdBackEnd=${env.IMAGE_ID_BACKEND} \
                                VpcCidr=${VPC_CIDR} \
                                PublicSubnet1Cidr=${PUBLIC_SUBNET1_CIDR} \
                                PublicSubnet2Cidr=${PUBLIC_SUBNET2_CIDR} \
                                TrustedSSHCIDR=${env.TRUSTED_SSH_CIDR} \
                                SwarmMasterToken=${SWARM_MASTER_TOKEN} \
                                SwarmMasterIP=${SWARM_MASTER_IP} \
                                HostnameFE=${env.HOSTNAME_FE} \
                                HostnameBE=${env.HOSTNAME_BE}
                    """

                    // Wait for stack to be fully deployed
                    sh """
                        aws cloudformation wait stack-create-complete --stack-name ProdEnv
                        aws cloudformation describe-stack-events --stack-name ProdEnv --max-items 20
                    """
                }
            }
        }

        stage("Get Load Balancer DNS and Update Production Environment") {
            steps {
                script {
                    def stackOutputs = sh(
                        script: """
                        aws cloudformation describe-stacks \
                            --stack-name ${PROD_STACK_NAME} \
                            --query 'Stacks[0].Outputs' \
                            --output json
                        """,
                        returnStdout: true
                    ).trim()

                    def outputs = readJSON text: stackOutputs
                    // 2) Extract each output by key
                    def lbDns = outputs.find { it.OutputKey == 'LoadBalancerDNS' }?.OutputValue
                    // 3) Store them in environment variables if desired
                    env.LOAD_BALANCER_DNS = lbDns
                    echo "LB DNS: ${env.LOAD_BALANCER_DNS}"

                    sh """
                        sed -i "s|\\(CLIENT_URL=http://\\)[^:]*\\(:8080\\)|\\1${env.LOAD_BALANCER_DNS}\\2|" server/.env
                    """

                    sh """
                        sed -i "s|\\(API_URL=http://\\)[^:]*\\(:3000\\)|\\1${env.LOAD_BALANCER_DNS}\\2|" client/.env
                    """
                }
            }
        }

        stage("Build & Push Docker images for Production Environment") {
            steps {
                script {
                    parallel(
                        "Client": {
                            dir('client') {
                                docker.withRegistry('', DOCKER_CREDENTIALS) {
                                def clientImage = docker.build("${IMAGE_NAME_PROD}-client", "-f ${DOCKERFILE_PROD} .")
                                clientImage.push("${IMAGE_TAG}")
                                clientImage.push("latest")
                                }
                            }
                        },
                        "Server": {
                            dir('server') {
                                docker.withRegistry('', DOCKER_CREDENTIALS) {
                                def serverImage = docker.build("${IMAGE_NAME_PROD}-server", "-f ${DOCKERFILE_PROD} .")
                                serverImage.push("${IMAGE_TAG}")
                                serverImage.push("latest")
                                }
                            }
                        }
                    )
                }
            }
        }
        
        stage("Deploy to Swarm") {
            steps {
                script {
                    // We assume Jenkins is the Swarm manager.
                    // The env variables HOSTNAME_FE and HOSTNAME_BE contain the hostnames for the new nodes.

                    def feHostname = env.HOSTNAME_FE
                    def beHostname = env.HOSTNAME_BE

                    // A small helper method to check if a node is known by the manager
                    def nodeInSwarm = { nodeName ->
                        def result = sh(script: "docker node ls --format '{{.Hostname}}' | grep -w '${nodeName}' || true", returnStdout: true).trim()
                        return (result == nodeName)
                    }

                    // ----- Wait for the front-end node -----
                    echo "Waiting for node '${feHostname}' to join the swarm..."
                    def tries = 5                  // Number of retries
                    def found = false
                    for (int i = 1; i <= tries; i++) {
                        if (nodeInSwarm(feHostname)) {
                            echo "Node '${feHostname}' is in the swarm."
                            found = true
                            break
                        }
                        echo "Node '${feHostname}' not found yet. Sleeping 10 seconds..."
                        sleep 10
                    }
                    if (!found) {
                        error("Front-end node '${feHostname}' never appeared in docker node ls after ${tries} retries.")
                    }

                    // ----- Wait for the back-end node -----
                    echo "Waiting for node '${beHostname}' to join the swarm..."
                    found = false
                    for (int i = 1; i <= tries; i++) {
                        if (nodeInSwarm(beHostname)) {
                            echo "Node '${beHostname}' is in the swarm."
                            found = true
                            break
                        }
                        echo "Node '${beHostname}' not found yet. Sleeping 10 seconds..."
                        sleep 10
                    }
                    if (!found) {
                        error("Back-end node '${beHostname}' never appeared in docker node ls after ${tries} retries.")
                    }

                    // Assign the label -> Need put condition for labeling
                    sh "docker node update --label-add role=server ${beHostname}"
                    sh "docker node update --label-add role=client ${feHostname}"

                    // Now that both nodes are labeled, you can safely deploy
                    sh "docker stack deploy -c docker-compose.yml ${env.PROD_STACK_NAME}"
                }
            }
        }
    }

    post {
        failure {
            script {
                sh """
                aws sns publish \
                  --region $AWS_REGION \
                  --topic-arn $SNS_TOPIC_ARN \
                  --message "Build Failed: Job ${env.JOB_NAME} #${env.BUILD_NUMBER}" \
                  --subject "Jenkins Build FAILURE"
                """
            }
        }
    }
}
