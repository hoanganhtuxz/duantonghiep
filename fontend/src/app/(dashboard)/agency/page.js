"use client";


import { useSetRecoilState } from "recoil";
import { queryProductState } from "@/atom";
import { Select, Input } from "antd";
import AddProductModal from "./(component)/addProduct";
import ProductsTable from "./(component)/listProduct";

export default function Page() {
  const setQueryState = useSetRecoilState(queryProductState);

  const handleChangeSort = (key) => {
    setQueryState((prev) => ({ ...prev, sort: key }));
  };
  const onSearch = (value) => {
    setQueryState((prev) => ({ ...prev, keyword: value }));
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <div className="flex gap-3">
          <Select
            defaultValue="desc"
            style={{ width: 100 }}
            onChange={handleChangeSort}
            options={[
              { value: "desc", label: "Mới nhất" },
              { value: "asc", label: "Cũ nhất" },
            ]}
          />
          <Input.Search
            onSearch={onSearch}
            allowClear
            className="w-[300px]"
            placeholder="Tìm kiếm"
          />
        </div>
        <div className="flex gap-3">
          <AddProductModal />
          <Select
            defaultValue="Xuất file"
            style={{ width: 100 }}
            onChange={handleChangeSort}
            options={[
              { value: "export-excel", label: "File Xxcel" },
              { value: "export-docs", label: "File Docs" },
            ]}
          />
        </div>
      </div>
      <ProductsTable />
    </div>
  );
}
