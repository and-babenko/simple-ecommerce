import React, { useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import qs from "qs";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaItem from "../components/PizzaItem";
import Skeleton from "../components/Skeleton";
import "../styles/components/_paginate.scss";
import { setPage, setFilters } from "../redux/slices/filtersSlice";
import { sortList } from "../components/Sort";
import { fetchPizzasFromStore } from "../redux/slices/pizzasSlice";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { search, category, sortItem, page } = useSelector(
    (state) => state.filters
  );
  const { pizzas, loadingIndicator } = useSelector((state) => state.pizzas);

  const fetchPizzas = async () => {
    dispatch(fetchPizzasFromStore({ search, category, sortItem, page }));
  };

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find(
        (obj) => obj.property === params.sortUrl && obj.sortBy === params.sortBy
      );

      dispatch(setFilters({ ...params, sort }));
      isSearch.current = true;
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      const queryObj = {
        page,
        sortUrl: sortItem.property,
        sortBy: sortItem.sortBy,
      };

      if (category !== 0) {
        queryObj.category = category;
      }
      if (search) {
        queryObj.search = search;
      }

      const queryString = qs.stringify(queryObj);
      navigate(`?${queryString}`);
    }
    isMounted.current = true;

    if (!isSearch.current) {
      fetchPizzas();
    }
    isSearch.current = false;
    // eslint-disable-next-line
  }, [category, sortItem.property, page, search]);

  const pizzasList = pizzas.map((pizza) => (
    <PizzaItem key={pizza.id} pizzaItem={pizza} />
  ));

  const skeletons = [...new Array(4)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {loadingIndicator === "rejected" ? (
        <div className="cart cart--empty">
          <h2>
            Произошла ошибка <span>😕</span>
          </h2>
          <p>
            Что-то пошло не так
            <br />
            Но мы уже работаем над исправлением этой ошибки
          </p>
        </div>
      ) : (
        <div className="content__items">
          {loadingIndicator === "pending" ? skeletons : pizzasList}
        </div>
      )}
      <ReactPaginate
        nextLabel=">"
        onPageChange={(e) => {
          dispatch(setPage(e.selected + 1));
        }}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={3}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousLinkClassName="page-link"
        previousClassName="page-item"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
}

export default Home;