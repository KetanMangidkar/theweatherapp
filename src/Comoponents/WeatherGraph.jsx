import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const WeatherGraph = ({ hourlydata }) => {
  const [hourtemp, setHourtemp] = useState({});

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < hourlydata.length / 2; i++) {
      arr.push(hourlydata[i].temp);
    }
    console.log(arr);
    setHourtemp([...arr]);
    // eslint-disable-next-line
  }, [hourlydata, setHourtemp]);

  var options = {
    chart: {
      height: 300,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Temp",
        data: hourtemp,
      },
    ],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "00",
      ],
    },
  };

  return (
    <>
      <div>
        <Chart
          options={options}
          series={options.series}
          data={options.series.data}
          type="area"
          width="100%"
          height="320px"
        />
      </div>
    </>
  );
};

export default WeatherGraph;
