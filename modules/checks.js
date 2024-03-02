export const qCheck = (q) => {
  q ? q : (q = document.getElementById("search-input").value);
  return q.trim() !== "" ? q : false;
};

export const resDataCheck = ({ artistRes, albumRes, trackRes }) => {
  if (
    artistRes?.artists?.items.length === 0 &&
    albumRes?.albums?.items.length === 0 &&
    trackRes?.tracks?.items.length === 0
  )
    return true;
};
