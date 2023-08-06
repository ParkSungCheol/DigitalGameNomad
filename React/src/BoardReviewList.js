import "./BoardFree.css";
import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import axios from "axios";
import board from "./Data.js";
import $ from 'jquery';
import font from './font.js';

const BoardList = () => {
  const [dataList, setDataList] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [condition, setCondition] = useState(false);

  let board_1 = board().board;
  let num = 1;

  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  useEffect(()=> {
    if(window.matchMedia('(max-width: 768px)').matches) {
      setCondition(false);
    }
    
    else {
      setCondition(true);
    }
  }, []);

  $( window ).resize(function() {
    //창크기 변화 감지
    if(window.matchMedia('(max-width: 768px)').matches) {
      setCondition(false);
    }
    
    else {
      setCondition(true);
    }
  });

  const columns = React.useMemo(
    () => {
     if(condition) {
      return(
      [
      {
        Header: "",
        id: "no",
        columns: [
          {
            Header: "번호",
            accessor: (item) => {
              return [item.postTitle, item.postKey];
            },
            Cell: (e) => (
              <a href={`/BoardReviewSee/${e.value[1]}`}> {e.value[1]} </a>
            ),
          },
        ],
      },
      {
        Header: "",
        id: "title",
        columns: [
          {
            Header: "제목",
            accessor: (item) => {
              return [item.postTitle, item.postKey];
            },
            Cell: (e) => (
              <a href={`/BoardReviewSee/${e.value[1]}`}> {e.value[0]} </a>
            ),
          },
        ],
      },
      {
        Header: "",
        id: "createDate",
        columns: [
          {
            Header: "등록일",
            accessor: (item) => {
              return item.post_date;
            },
          },
        ],
      },
      {
        Header: "",
        id: "createuser",
        columns: [
          {
            Header: "작성자",
            accessor: (item) => {
              return item.user.user_id;
            },
            Cell: (e) => (
              font(e.value)
            ),
          },
        ],
      },
      {
        Header: "",
        id: "game_name",
        columns: [
          {
            Header: "게임명",
            accessor: (item) => {
              return item.game_name;
            },
          },
        ],
      },
      {
        Header: "",
        id: "star-ranking",
        columns: [
          {
            Header: "별점",
            accessor: (item) => {
              if (item.post_score == 0) return "★x0";
              else if (item.post_score == 20) return "★x1";
              else if (item.post_score == 40) return "★x2";
              else if (item.post_score == 60) return "★x3";
              else if (item.post_score == 80) return "★x4";
              else if (item.post_score == 100) return "★x5";
              return "";
            },
          },
        ],
      },
      {
        Header: "",
        id: "readCount",
        columns: [
          {
            Header: "조회",
            accessor: (item) => {
              return item.post_view;
            },
          },
        ],
      },
    ])}
    else {
      return(
      [
      {
        Header: "",
        id: "title",
        columns: [
          {
            Header: "제목",
            accessor: (item) => {
              return [item.postTitle, item.postKey];
            },
            Cell: (e) => (
              <a href={`/BoardReviewSee/${e.value[1]}`}> {e.value[0]} </a>
            ),
          },
        ],
      },
      {
        Header: "",
        id: "createuser",
        columns: [
          {
            Header: "작성자",
            accessor: (item) => {
              return item.user.user_id;
            },
            Cell: (e) => (
              font(e.value)
            ),
          },
        ],
      },
      {
        Header: "",
        id: "game_name",
        columns: [
          {
            Header: "게임명",
            accessor: (item) => {
              return item.game_name;
            },
          },
        ],
      },
      {
        Header: "",
        id: "readCount",
        columns: [
          {
            Header: "조회",
            accessor: (item) => {
              return item.post_view;
            },
          },
        ],
      },
    ])
    }}
    , [condition]
  );

  const data = [];
  const nameRef = React.createRef();

  useEffect(() => {
    if (board_1[0] != "re") {
      setSearchValue("선택");
      setDataList(board_1.filter((e) => e.post_topic === "후기"));
  
    }
  }, [board_1]);

  dataList.map((item) => {
    dataList.filter((e) => e.post_topic == "후기");
    data.push(item);
  });

  function selectBoxChange(e) {

    setSearchValue(e.target.value);
  }

  //------------------검색 부분----------------------
  function search() {
    let input = nameRef;

    if (searchValue === "제목") {
      board_1
        .filter((e) => e.postTitle == null)
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.postTitle != null)
        .filter((e) => !e.postTitle.includes(input.current.value))
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.postTitle != null)
        .filter((e) => e.postTitle.includes(input.current.value))
        .forEach((e) => (e.show = true));
    } else if (searchValue === "내용") {
      board_1
        .filter((e) => e.postText == null)
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.postText != null)
        .filter((e) => !e.postText.includes(input.current.value))
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.postText != null)
        .filter((e) => e.postText.includes(input.current.value))
        .forEach((e) => (e.show = true));
    } else if (searchValue === "작성자") {
      board_1
        .filter((e) => e.user.user_id == null)
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.user.user_id != null)
        .filter((e) => !e.user.user_id.includes(input.current.value))
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.user.user_id != null)
        .filter((e) => e.user.user_id.includes(input.current.value))
        .forEach((e) => (e.show = true));
    } else if (searchValue === "게임명") {
      board_1
        .filter((e) => e.game_name == null)
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.game_name != null)
        .filter((e) => !e.game_name.includes(input.current.value))
        .forEach((e) => (e.show = false));
      board_1
        .filter((e) => e.game_name != null)
        .filter((e) => e.game_name.includes(input.current.value))
        .forEach((e) => (e.show = true));
    } else {
      alert("검색기준을 설정해주세요");
      return;
    }

    setDataList(
      board_1.filter((e) => e.show === true && e.post_topic === "후기")
    );
  }

  //------------------- 리셋 부분---------------------
  function reset() {
    board_1.forEach((e) => {
      e.show = true;
    });
    setDataList(
      board_1.filter((e) => e.show === true && e.post_topic === "후기")
    );
    setSearchValue("선택");
  }

  function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
      },
      useSortBy,
      usePagination
    )

    return (
      <>
        <table className="common-table" {...getTableProps()}>
          <thead className="c__thead">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th
                    className="common-table-header-column"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        className="common-table-column"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
        <button className="b__btn" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'< 처음'}
        </button>{' '}
        <button className="b__btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'◀'}
        </button>{' '}

        <span className="b__pspan">
          {' '}
          <strong className="b__pst">
            {pageIndex + 1} / {pageOptions.length}
          </strong>{' '}
        </span>

        <button className="b__btn" onClick={() => nextPage()} disabled={!canNextPage}>
          {'▶'}
        </button>{' '}
        <button className="b__btn" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'맨끝 >'}
        </button>{' '}
       
        <div className="b__bottom">
        <span className="b__pspan1">
          페이지 찾기 :{' '}
          <input
            className="b__pinput"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
         className="b__pselect"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[3, 5, 8, 10, 20].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}개 보기
            </option>
          ))}
        </select>
        </div>
      </div>

        <br />

        <hr/>

        <div className="b__lbox">
          <label className="center">
            <select
              className="free-select"
              onChange={selectBoxChange}
              value={searchValue}
            >
              <option value="선택">선택</option>
              <option value="제목">제목</option>
              <option value="내용">내용</option>
              <option value="작성자">작성자</option>
              <option value="게임명">게임명</option>
            </select>
            <input id="create_btn" type="text" name="title" ref={nameRef} />
            <input
              id="search_btn"
              type="button"
              value="검색"
              onClick={(e) => search()}
            />
            <input
              id="reset_btn"
              type="button"
              value="리셋"
              onClick={(e) => reset()}
            />
            <br />
          </label>
        </div>
      </>
    );
  }

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
};

export default BoardList;
