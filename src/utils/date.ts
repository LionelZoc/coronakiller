export const getHumanizeTime = (totalPlayTime) => {
  const seconds = Math.floor(totalPlayTime % 60);
  const minutes = Math.floor((totalPlayTime / 60) % 60);
  const hours = Math.floor((totalPlayTime / (60 * 60)) % 24);
  const days = Math.floor(totalPlayTime / (60 * 60 * 24));

  return {
    canBeSeconds: totalPlayTime === 60,
    totalPlayTime,
    days,
    hours,
    minutes,
    seconds,
  };
};
