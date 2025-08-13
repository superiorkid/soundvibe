export const randomGradient = () => {
  const colors = [
    ["#ff9a9e", "#fad0c4"],
    ["#a18cd1", "#fbc2eb"],
    ["#fbc2eb", "#a6c1ee"],
    ["#ffecd2", "#fcb69f"],
    ["#f6d365", "#fda085"],
    ["#84fab0", "#8fd3f4"],
    ["#cfd9df", "#e2ebf0"],
    ["#ff9966", "#ff5e62"],
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  const [start, end] = colors[randomIndex];
  return `linear-gradient(135deg, ${start}, ${end})`;
};
