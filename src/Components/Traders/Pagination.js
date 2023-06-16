const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const leftBound = currentPage - delta;
        const rightBound = currentPage + delta + 1;
        let prev = null;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= leftBound && i < rightBound)) {
                if (prev && i - prev !== 1) {
                    range.push(null);
                }
                range.push(i);
                prev = i;
            }
        }

        return range;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="mt-3">
            <ul className="pagination justify-content-center border-0">
                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers.map((pageNumber, index) =>
                    pageNumber ? (
                        <li
                            key={index}
                            className={`page-item${pageNumber === currentPage ? ' active' : ''}`}
                        >
                            <button className="page-link" onClick={() => onPageChange(pageNumber)}>
                                {pageNumber}
                            </button>
                        </li>
                    ) : (
                        <li key={index} className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    )
                )}
                <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;