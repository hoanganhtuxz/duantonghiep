// bóc thời gian từ option dụ theo value
export const getDateRange = (value) => {
  const today = new Date();
  let startDate, endDate;

  switch (value) {
    case "1w":
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = today;
      break;
    case "2w":
      startDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
      endDate = today;
      break;
    case "1m":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "3m":
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "6m":
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "9m":
      startDate = new Date(today.getFullYear(), today.getMonth() - 9, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "12m":
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    default:
      startDate = null;
      endDate = null;
  }

  return { startDate, endDate };
};

// lấy giá trị start date
export const getDefaultStartDate = (value) => {
  const today = new Date();
  let startDate;

  switch (value) {
    case "1w":
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    // Thêm các trường hợp khác nếu cần
    default:
      startDate = null;
  }

  if (startDate) {
    const year = startDate.getFullYear();
    const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const day = startDate.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  return null;
};

// lây ra mặc định thời gian 7 ngày

export const getDefaultEndDate = (value) => {
  const today = new Date();
  let endDate;

  switch (value) {
    case "1w":
      endDate = today;
      break;
    // Thêm các trường hợp khác nếu cần
    default:
      endDate = null;
  }

  if (endDate) {
    const year = endDate.getFullYear();
    const month = (endDate.getMonth() + 1).toString().padStart(2, "0");
    const day = endDate.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  return null;
};

// chuyển đổi thời gain
export const processData = (data) => {
  const dateStrings = [];

  for (const item of data) {
    const date = new Date(item._id.replace(" GM", " GMT"));
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const dateString = `${day}/${month}/${year}`;
      dateStrings.push(dateString);
    }
  }

  return dateStrings;
};

// chart
export const extractTotalQuantities = (data) => {
  const totalQuantities = [];

  for (const item of data) {
    totalQuantities.push(item.totalQuantity);
  }

  return totalQuantities;
};


// tổng tiền 
export const calculateTotalPrice = (data) => {
  console.log('data',data)
  return data.reduce((total, product) => {
    const { price, quantity } = product;
    const productTotalPrice = quantity > 1 ? price * quantity : price;
    return total + productTotalPrice;
  }, 0);
};

// format kiểu tiền
export const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};
