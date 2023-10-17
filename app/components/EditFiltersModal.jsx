import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

import Toggle from "./Toggle";
import CustomModal from "./CustomModal";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";

export default function EditFiltersModal() {
  const t = useTranslations("FilterModal");
  const { filters, setFilters, habits, setHabits } = useAuthContext();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [auxInfo, setAuxInfo] = useState([]);

  const searchParams = useSearchParams();
  const showEditFiltersModal = searchParams.get("filter") != undefined;
  const router = useRouter();

  const timeoutId = useRef(null);

  function validateFilter() {
    var anyError = false;
    var errorMsg = [];
    var auxFilterType = filterType ? "negative" : "positive";

    if (!filterName) {
      anyError = true;
      errorMsg.push(t("error-missing"));
    }

    if (filterName.length > 12) {
      anyError = true;
      errorMsg.push(t("error-filterNameLength"));
    }

    if (filterName === "all") {
      anyError = true;
      errorMsg.push(t("error-filter-all"));
    }

    if (filters.some((filter) => filter.title === filterName && filter.type === auxFilterType)) {
      anyError = true;
      errorMsg.push(t("error-filterExisting"));
    }

    setAuxInfo(errorMsg);

    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      setAuxInfo([]);
    }, 6000);

    return !anyError;
  }

  function editHabits(changedFilter) {
    var newHabits = [...habits];
    var auxFilterType = filterType ? "negative" : "positive";

    newHabits.forEach((habit, index) => {
      if (habit.type === changedFilter.type && habit.category === changedFilter.title) {
        if (changedFilter.type == auxFilterType) {
          habit.category = filterName;
          //console.log("same type, changed category");
        } else {
          habit.category = "all";
          //console.log("different type, changed category to all");
        }
      }
    });

    setHabits(newHabits);
  }

  function cleanUpHabits(deletedFilter) {
    var newHabits = [...habits];

    newHabits.forEach((habit, index) => {
      if (habit.type === deletedFilter.type && habit.category === deletedFilter.title) {
        habit.category = "all";
      }
    });

    setHabits(newHabits);
  }

  function deleteFilter() {
    cleanUpHabits(selectedFilter);

    var newFilters = [...filters];

    newFilters.forEach((filter, index) => {
      if (filter.title === selectedFilter.title && filter.type === selectedFilter.type) {
        newFilters.splice(index, 1);
      }
    });

    setFilters(newFilters);
    closeModal();
  }

  function editFilter() {
    if (!validateFilter()) return;

    editHabits(selectedFilter);

    var newFilters = [...filters];

    newFilters.forEach((filter) => {
      if (filter.title === selectedFilter.title && filter.type === selectedFilter.type) {
        filter.title = filterName;
        filter.type = filterType ? "negative" : "positive";
      }
    });

    setFilters(newFilters);
    closeModal();
  }

  function addNewFilter() {
    if (!validateFilter()) return;

    var newFilters = [...filters];

    newFilters.push({
      title: filterName,
      type: filterType ? "negative" : "positive",
    });

    setFilters(newFilters);
    closeModal();
  }

  function closeModal() {
    router.push("/");
    setIsEditing(false);
    resetFilter();
  }

  function resetFilter() {
    setSelectedFilter("");
    setFilterName("");
    setFilterType("");
  }

  useEffect(() => {
    if (!isEditing) resetFilter();
  }, [isEditing]);

  useEffect(() => {
    if (selectedFilter != "") {
      setFilterName(selectedFilter.title);
      setFilterType(selectedFilter.type === "negative" ? true : false);
    }
  }, [selectedFilter]);

  return (
    <CustomModal displayState={showEditFiltersModal} onClose={closeModal} title={t("title")}>
      <div className="mb-4">
        <Toggle getter={isEditing} setter={setIsEditing} firstOption={t("toggle-add")} secondOption={t("toggle-edit")} />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col mb-4">
          {isEditing && (
            <>
              <select
                className="p-2 mb-4 border rounded-md dark:bg-pale-800 dark:text-white"
                value={selectedFilter}
                onChange={(e) => {
                  const selectedValue = JSON.parse(e.target.value);
                  setSelectedFilter(selectedValue);
                  setFilterName(selectedValue.title);
                }}
              >
                <option value="" hidden>
                  {t("select")}
                </option>
                {filters
                  .filter((filter, title, type) => filter.title != "all")
                  .map((filter) => (
                    <option
                      className={`font-semibold ${filter.type === "negative" ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}`}
                      key={filter.title + filter.type}
                      value={JSON.stringify({
                        title: filter.title,
                        type: filter.type,
                      })}
                    >
                      {filter.title.charAt(0).toUpperCase() + filter.title.slice(1)}
                    </option>
                  ))}
              </select>
            </>
          )}

          {((isEditing && selectedFilter != "") || !isEditing) && (
            <div className="flex flex-col gap-1">
              {isEditing && (
                <div
                  className="w-full relative mb-4
                    before:cotent-[''] before:absolute before:top-3 before:left-0 before:right-0 before:z-[-1] 
                    before:h-1 before:bg-pale-300 dark:before:bg-pale-600"
                >
                  <h3 className="relative inline pr-4 mb-2 text-center bg-pale-50 dark:bg-pale-800 dark:text-pale-400">
                    {t("editing")} <span className="font-bold dark:text-white">{selectedFilter.title} </span>
                  </h3>
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <label htmlFor="filterTitle" className="w-20 dark:text-pale-100">
                  {t("name")}
                </label>
                <input
                  className="w-full p-2 border rounded-md border-pale-400 dark:bg-pale-700 dark:text-white"
                  name="filterTitle"
                  type="text"
                  value={filterName}
                  placeholder={t("name-default")}
                  onChange={(e) => {
                    var text = e.target.value;
                    text = text.replace(/[^a-zA-Z0-9 ]/g, "");
                    text = text.toLowerCase();
                    setFilterName(text);
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mb-10">
                <label htmlFor="filterType" className="w-20 dark:text-pale-100">
                  {t("type")}
                </label>
                <Toggle getter={filterType} setter={setFilterType} firstOption={t("positive")} secondOption={t("negative")} type="greenred" />
              </div>

              {isEditing && (
                <>
                  <button className="w-full p-2 mb-4 text-white bg-red-600 rounded-md" onClick={deleteFilter}>
                    {t("delete")}
                  </button>

                  <button className="w-full p-2 text-white capitalize rounded-md bg-pale-600" onClick={editFilter}>
                    {t("edit")} {selectedFilter.title}
                  </button>
                </>
              )}

              {!isEditing && (
                <button className="w-full p-2 text-white capitalize rounded-md bg-pale-600" onClick={addNewFilter}>
                  {t("add")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {auxInfo.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {auxInfo.map((info, index) => (
            <div className="text-xs text-red-600">
              {info}
              {index !== auxInfo.length - 1 && ", "}
            </div>
          ))}
        </div>
      )}
    </CustomModal>
  );
}
