//  RMIT University Vietnam
//   Course: COSC2767 Systems Deployment and Operations
//   Semester: 2024C
//   Assessment: Assignment 2
//   Author: TEAM NEWBIE
//   ID: 	
// Nguyen Minh Quan - S3927181
// Nguyen Nghia Hiep - S3978270
// Nguyen Le Thu Nhan - S3932151
// Nguyen Phuoc Nhu Phuc - S3819660

//   Created  date: 3rd Jan 2024
//   Last modified: 16th Jan 2024


const { caculateOrderTotal } = require("../../utils/store");

describe("caculateOrderTotal", () => {
  it("should calculate the total price of an order correctly", () => {
    const order = {
      products: [
        { totalPrice: 100, status: "Active" },
        { totalPrice: 50, status: "Active" },
        { totalPrice: 30, status: "Active" },
      ],
    };

    const total = caculateOrderTotal(order);

    expect(total).toBe(180); // 100 + 50 + 30
  });

  it("should exclude cancelled products from the total price", () => {
    const order = {
      products: [
        { totalPrice: 100, status: "Active" },
        { totalPrice: 50, status: "Cancelled" },
        { totalPrice: 30, status: "Active" },
      ],
    };

    const total = caculateOrderTotal(order);

    expect(total).toBe(130); // 100 + 30
  });

  it("should return 0 if all products are cancelled", () => {
    const order = {
      products: [
        { totalPrice: 100, status: "Cancelled" },
        { totalPrice: 50, status: "Cancelled" },
      ],
    };

    const total = caculateOrderTotal(order);

    expect(total).toBe(0);
  });

  it("should return 0 if there are no products in the order", () => {
    const order = { products: [] };

    const total = caculateOrderTotal(order);

    expect(total).toBe(0);
  });
});
