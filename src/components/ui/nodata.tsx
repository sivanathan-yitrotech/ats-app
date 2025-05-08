// NoData.js

const NoData = () => {
  return (
    <div className="flex flex-col my-5 items-center justify-center gap-2 h-full p-4 text-center">
      <h2 className="text-md font-semibold text-gray-700">No Data Available</h2>
      <p className="text-gray-500">
        It seems we couldn't find any data to display.
      </p>
    </div>
  );
};

export default NoData;
