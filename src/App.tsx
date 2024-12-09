import { useEffect, useState } from "react";

type Feed = {
  created_at: string;
  entry_id: number;
  field1: string;
  field2: string;
  field3: string;
};

type Response = {
  channel: {};
  feeds: Feed[];
};

function App() {
  const [data, setData] = useState<Response>();
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const thingspeak = await fetch(
          "https://api.thingspeak.com/channels/2725512/feeds.json?results=1"
        );
        const data = await thingspeak.json();
        setData(data);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const determineStatus = (value: number, type: "ph" | "turbidity" | "tds") => {
    if (type === "ph") {
      if (value >= 6.5 && value <= 7.8)
        return {
          text: "Normal",
          color: "text-green-500",
          description: "PH air normal.",
        };
      if (value > 7.5 && value < 8)
        return {
          text: "Warning",
          color: "text-yellow-500",
          description: "PH tidak normal.",
        };
      if (value < 6.5)
        return {
          text: "Danger",
          color: "text-red-500",
          description: "Air terlalu asam.",
        };
      if (value > 8 && value <= 14)
        return {
          text: "Danger",
          color: "text-red-500",
          description: "Air terlalu basa.",
        };
      return {
        text: "Danger",
        color: "text-red-500",
        description: "PH terlalu tinggi (>8).",
      };
    } else if (type === "turbidity") {
      if (value <= 15)
        return {
          text: "Normal",
          color: "text-green-500",
          description: "Kekeruhan dalam batas normal.",
        };
      if (value > 15 && value <= 30)
        return {
          text: "Warning",
          color: "text-yellow-500",
          description: "Kekeruhan sedikit tinggi (>15 NTU).",
        };
      return {
        text: "Danger",
        color: "text-red-500",
        description: "Kekeruhan sangat tinggi (>30 NTU).",
      };
    } else if (type === "tds") {
      if (value >= 50 && value <= 700)
        return {
          text: "Normal",
          color: "text-green-500",
          description: "TDS dalam batas normal.",
        };
      if (value > 500 && value <= 1000)
        return {
          text: "Warning",
          color: "text-yellow-500",
          description: "TDS sedikit tinggi (>500 ppm).",
        };
      return {
        text: "Danger",
        color: "text-red-500",
        description: "TDS sangat tinggi (>1000 ppm).",
      };
    }
    return {
      text: "Unknown",
      color: "text-black",
      description: "Data tidak valid.",
    };
  };

  if (!data)
    return (
      <>
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
      </>
    );

  const ph = parseFloat(data.feeds[0].field1);
  const turbidity = parseFloat(data.feeds[0].field2);
  const tds = parseFloat(data.feeds[0].field3);

  const phStatus = determineStatus(ph, "ph");
  const turbidityStatus = determineStatus(turbidity, "turbidity");
  const tdsStatus = determineStatus(tds, "tds");

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
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                    aria-current="page"
                  >
                    Home
                  </a>
                  <a
                    href="/history"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
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
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white "
              aria-current="page"
            >
              Home
            </a>
            <a
              href="/history"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              History
            </a>
          </div>
        </div>
      </nav>
      <section className="w-full mt-10 h-screen flex justify-center items-center flex-col text-center">
        <div className={`text-5xl mb-7 font-bold w-full ${phStatus.color}`}>
          PH : {ph}{" "}
          <span className="text-xl mt-2 block">{phStatus.description}</span>
        </div>
        <div
          className={`text-5xl mb-7 font-bold w-full ${turbidityStatus.color}`}
        >
          Turbidity : {turbidity} NTU{" "}
          <span className="text-xl mt-2 block">
            {turbidityStatus.description}
          </span>
        </div>
        <div className={`text-5xl mb-7 font-bold w-full ${tdsStatus.color}`}>
          TDS : {tds} ppm{" "}
          <span className="text-xl mt-2 block">{tdsStatus.description}</span>
        </div>
        <hr />
        <div
          className={`mt-10 text-5xl font-bold ${
            phStatus.color === "text-red-500" ||
            turbidityStatus.color === "text-red-500" ||
            tdsStatus.color === "text-red-500"
              ? "text-red-500"
              : phStatus.color === "text-yellow-500" ||
                turbidityStatus.color === "text-yellow-500" ||
                tdsStatus.color === "text-yellow-500"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          Status :
          {phStatus.color === "text-red-500" ||
          turbidityStatus.color === "text-red-500" ||
          tdsStatus.color === "text-red-500"
            ? " Danger"
            : phStatus.color === "text-yellow-500" ||
              turbidityStatus.color === "text-yellow-500" ||
              tdsStatus.color === "text-yellow-500"
            ? " Warning"
            : " Normal"}
        </div>
      </section>
    </>
  );
}

export default App;
