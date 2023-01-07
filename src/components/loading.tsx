export function Loading(): JSX.Element {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
