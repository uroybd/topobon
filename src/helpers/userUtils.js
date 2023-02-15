function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function getPositions(trees) {
  let minInRow = Math.floor(Math.sqrt(trees.length));
  let maxInRow = Math.ceil(Math.sqrt(trees.length));
  if (minInRow < maxInRow) {
    trees = trees.concat(
      Array(Math.pow(maxInRow, 2) - trees.length).fill([0, "", ""])
    );
  }
  trees = shuffle([...trees]);
  let levels = sliceIntoChunks(trees, maxInRow);
  return levels;
}

function forestData(data) {
  const canvasTrees = data.collections.note.map((n) => {
    let v = parseInt(n.data.noteIcon);
    let height = 2;
    if (!v) {
      v = n.data.noteIcon;
    } else {
      height = v;
      v = `tree-${v}`;
    }
    return [v, n.url, n.data.title || n.fileSlug, height];
  });
  return getPositions(canvasTrees);
}

exports.forestData = forestData;
