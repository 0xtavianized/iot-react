import { useEffect, useState } from "react";
import * as React from "react";

type Feed = {
  created_at: string;
  field1: string;
  field2: string;
  field3: string;
};

type Response = {
  channel: {};
  feeds: Feed[];
};

function History() {
  const [data, setData] = useState<Response>();
  const [error, setError] = useState<null | string>(null);

  const [sensor, setSensor] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  let no = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const thingspeak = await fetch(
          "https://api.thingspeak.com/channels/2725512/feeds.json"
        );
        const data = await thingspeak.json();
        setData(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };
    fetchData();
  }, []);

  const handleSensorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSensor(event.target.value);
  };

  const filterData = () => {
    if (!data) return [];
    return data.feeds.filter((feed) => {
      const feedDate = new Date(feed.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || feedDate >= start) && (!end || feedDate <= end);
    });
  };

  const filteredData = filterData();

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-2xl font-semibold text-red-500">Error: {error}</p>
      </div>
    );

  if (!data)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>
          <svg
            className="animate-spin -ml-1 mr-3 h-10 w-10 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p className="text-2xl font-semibold">Loading...</p>
      </div>
    );

  return (
    <>
      <nav className="bg-gray-800 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    aria-current="page"
                  >
                    Home
                  </a>
                  <a
                    href="/history"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white "
                  >
                    History
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <a
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              aria-current="page"
            >
              Home
            </a>
            <a
              href="/history"
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
            >
              History
            </a>
          </div>
        </div>
      </nav>
      <section className="w-full mt-10 h-screen flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-5">History Sensor</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-5">
          <label>
            Pilih Sensor:
            <select
              value={sensor}
              onChange={handleSensorChange}
              className="border px-3 py-2 ml-2"
            >
              <option value="all">Semua Sensor</option>
              <option value="field1">PH</option>
              <option value="field2">Turbidity</option>
              <option value="field3">TDS</option>
            </select>
          </label>
          <label>
            Waktu Awal:
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 ml-2"
            />
          </label>
          <label>
            Waktu Akhir:
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 ml-2"
            />
          </label>
        </div>
        <table className="table-auto border-collapse border border-gray-400 w-3/4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">No.</th>
              <th className="border border-gray-400 px-4 py-2">Waktu</th>
              {sensor === "all" ? (
                <>
                  <th className="border border-gray-400 px-4 py-2">pH</th>
                  <th className="border border-gray-400 px-4 py-2">
                    Turbidity
                  </th>
                  <th className="border border-gray-400 px-4 py-2">TDS</th>
                </>
              ) : (
                <th className="border border-gray-400 px-4 py-2">Value</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((feed, index) => (
              <tr key={feed.created_at} className="hover:bg-gray-100">
                <td className="border border-gray-400 px-4 py-2">{no++}</td>
                <td className="border border-gray-400 px-4 py-2">
                  {new Date(feed.created_at).toLocaleString()}
                </td>
                {sensor === "all" ? (
                  <>
                    <td className="border border-gray-400 px-4 py-2">
                      {feed.field1}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {feed.field2} NTU
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {feed.field3} ppm
                    </td>
                  </>
                ) : (
                  <td className="border border-gray-400 px-4 py-2">
                    {sensor === "field1"
                      ? `${feed.field1}`
                      : sensor === "field2"
                      ? `${feed.field2} NTU`
                      : `${feed.field3} ppm`}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-gray-500">Tidak ada data.</p>
        )}
        <div className="flex justify-center items-center mt-6 mb-10 pb-5 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white text-black border-solid border-2 border-black disabled:opacity-50"
          >
            Previous
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white text-black border-solid border-2 border-black disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}

export default History;
