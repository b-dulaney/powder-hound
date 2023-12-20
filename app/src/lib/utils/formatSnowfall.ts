export const formatSnowfall = (snowfall: number) => {
    if (snowfall > 1){
      return Math.round(snowfall).toString();
    }
    return (snowfall < 1 && snowfall > 0) ? '<1' : snowfall.toString();
  }