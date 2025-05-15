
import React, { useState, useEffect } from "react";
import adminLayout from "../hoc/adminLayout";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import DownloadCsvButton from "../components/DownloadShaghelinCalculate";
import ModalComponent from "../components/ModalComponent";

function VwShaghelCalculationResult() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(30);
  const [personnel, setPersonnel] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const location = useLocation();
  const { id } = location.state || {}; // fallback if no state passed


  const fetchData = async () => {
    const skip = (currentPage - 1) * limit;

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/view/VwShaghelCalculationResult?id=${id}&skip=${skip}&limit=${limit}`;
      const response = await axios.get(url);

      const fetchedData = response.data;

      // If you have totalCount from headers or response, update accordingly
      // Example: const total = parseInt(response.headers['x-total-count']) || 0;
      // setTotalCount(total);
      // setTotalPages(Math.ceil(total / limit));

      setData(fetchedData);
      setTotalCount(0); // update if you have total count
      setTotalPages(0); // update if you have total count
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const goToPage = (page, event) => {
    if (event) event.preventDefault();
    if (page >= 1 && (totalPages === 0 || page <= totalPages)) {
      setCurrentPage(page);
      setLoading(true);
    }
  };

  if (loading) {
    
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex text-muted">
      <DownloadCsvButton id={id} />
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              {data.length > 0
                ? Object.keys(data[0]).map((col) => <th key={col}>{col}</th>)
                : <th>No Data</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((val, i) => (
                    <td key={i}>{val !== null ? val.toString() : ""}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100%">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="table-bottom-center-pagination"
        aria-label="Page navigation example"
      >
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              href="#"
              onClick={(e) => goToPage(currentPage - 1, e)}
              className="page-link"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>

          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage}
              {totalPages > 0 ? ` of ${totalPages}` : ""}
            </span>
          </li>

          <li
            className={`page-item ${
              totalPages > 0 && currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <a
              href="#"
              onClick={(e) => goToPage(currentPage + 1, e)}
              className="page-link"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default adminLayout(VwShaghelCalculationResult);
