import React from "react";
import adminLayout from "../hoc/adminLayout";
import axios from "axios";
import { Link } from "react-router-dom";

import ModalComponent from "../components/ModalComponent";

class Companiews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      currentPage: 1,
      totalPages: 1,
      limit: 30,
      company: {},
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
  }


  fetchData = async () => {
    const { currentPage, limit } = this.state;
    const skip = (currentPage - 1) * limit;

    try {
      // Replace with your actual API URL
      const url = `${process.env.REACT_APP_API_URL}/api/v1/view/companies?skip=${skip}&limit=${limit}`;

      const response = await axios.get(url);

      // Assuming your API returns an array of data
      // and optionally total count in response headers or body
      // Adjust accordingly if your API returns total_count or similar

      // Example if total count is in a custom header 'X-Total-Count':
      // const totalCount = parseInt(response.headers['x-total-count']) || 0;

      // If your API does NOT return total count, you can disable Next button when data.length < limit
      const data = response.data;

      this.setState({
        data,
        // If you have totalCount, set it here; else calculate totalPages based on data length
        totalCount: 0, // set to 0 or actual total count if available
        totalPages: 0, // you can calculate if totalCount is available: Math.ceil(totalCount / limit)
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({
        loading: false,
      });
    }
  };

  goToPage = (page, event) => {
    if (event) event.preventDefault();
    const { totalPages } = this.state;
    if (page >= 1 && (totalPages === 0 || page <= totalPages)) {
      this.setState({ currentPage: page, loading: true }, this.fetchData);
    }
  };

  render() {
    const { data, loading, currentPage, totalPages, limit } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div className="d-flex text-muted">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <td>ID</td>
                <td>NAME</td>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={idx}>
                 
                   <td>{item.ID}</td>
                   <td>{item.Title}</td>
                   <td><Link className="btn btn-primary"  state={{ id: item.Title }} to={`/VwShaghelCalculationResult/`}>VwShaghelCalculationResult</Link></td>

                   <td><Link className="btn btn-primary" state={{ id: item.ID }} to={`/ActoShaghelinInfo/`}>ActoShaghelinInfo</Link></td>

                   <td><Link className="btn btn-info" state={{ id: item.ID }} to={`/ActoBazneshasteInfo/`}>ActoBazneshasteInfo</Link></td>
                   <td><Link className="btn btn-info" state={{ id: item.ID }} to={`/ActoBazneshasteFinalValue/`}>ActoBazneshasteFinalValue</Link></td>
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
                onClick={(e) => this.goToPage(currentPage - 1, e)}
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
                onClick={(e) => this.goToPage(currentPage + 1, e)}
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
}

export default adminLayout(Companiews);
