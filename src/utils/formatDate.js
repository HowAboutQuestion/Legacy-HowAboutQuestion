import { format } from 'date-fns';

export const getTodayDate = () => {
  const offset = 1000 * 60 * 60 * 9;
  const koreaTime = new Date((new Date()).getTime() + offset).toISOString().split("T")[0];
  
  
  return koreaTime;
}

export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};
