import React from "react";

function DownloadCsvButton({ id }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/view/VwShaghelCalculationResult/csv?id=${encodeURIComponent(id)}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get the filename from the content-disposition header if available
      const disposition = response.headers.get("Content-Disposition");
      let filename = `VwShaghelCalculationResult_${id}.csv`;
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // Get the blob data
      const blob = await response.blob();

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download CSV:", error);
      alert("Failed to download CSV file.");
    }
  };

  return (
    <button className="btn btn-success" onClick={handleDownload}>
     <i className="fa fa-download" aria-hidden="true"></i> Download CSV
    </button>
  );
}

export default DownloadCsvButton;
