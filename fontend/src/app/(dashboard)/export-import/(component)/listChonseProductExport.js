import { Avatar, Button, List } from "antd";
import React from "react";
import NumberProductExport from "./NumberProductExport";
import { formatPrice } from "@/utils";

const ListChonseProductExport = ({
  listChonseProduct,
  handleRemoveExportProduct,
  chonseQuantity,
}) => {
  return (
    <div>
      <List
        className="mb-4"
        dataSource={listChonseProduct}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[
              <NumberProductExport
                key="quantity"
                handleChangQuantity={(newQuantity) =>
                  chonseQuantity(item?._id, newQuantity)
                }
                maxProduct={item?.totalQuatity}
              />,
              <Button
                type="text"
                key="delete"
                danger
                onClick={() => handleRemoveExportProduct(item?._id)}
              >
                Xoá
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={50}
                  shape="square"
                  className="bg-blue-100"
                  src={`https://static.thenounproject.com/png/4974686-200.png`}
                />
              }
              title={
                <div className="hover:text-blue-500 text-blue-500 font-medium">
                  <p>{item?.name}</p>
                  <span className="text-red-500">
                    {formatPrice(item?.price)}
                  </span>
                </div>
              }
              description={<div>Mã code: {item?.code || " *** *** *** "}</div>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListChonseProductExport;
