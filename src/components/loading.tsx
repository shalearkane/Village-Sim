import { BallTriangle } from "react-loader-spinner";

function Loading() {
  return (
    <div className="h-[100vh] w-[100vw] gap-5 flex justify-center items-center flex-col">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="white"
        ariaLabel="ball-triangle-loading"
        visible={true}
      />
      <h1>Loading assets ...</h1>
    </div>
  );
}

export default Loading;
