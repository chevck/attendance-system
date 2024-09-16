export function PageLoader({ children, loading = false }) {
  return (
    <>
      {loading ? (
        <div className='page-loader-wrapper'>
          <div class='page-loader'></div>
        </div>
      ) : null}
      {children}
    </>
  );
}
