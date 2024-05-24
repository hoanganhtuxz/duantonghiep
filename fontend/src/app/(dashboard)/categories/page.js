"use client";

import AddCategoryModal from "../../../components/categories/addCreateModal";
import CategoryTable from "../../../components/categories/listCategory";
import { Input, Select, Dropdown, Button, Space } from "antd";
import { useSetRecoilState } from "recoil";
import { queryCategoryState } from "@/atom";
export const dynamic = 'force-dynamic';

export default function Page() {
  const setQueryState = useSetRecoilState(queryCategoryState);

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
          <AddCategoryModal />
        </div>
      </div>
      <CategoryTable />
    </div>
  );
}
