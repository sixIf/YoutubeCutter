export function formatTime(duration: number): string{
    const nonPaddedIntl = Intl.NumberFormat('fr', { minimumIntegerDigits: 1 });
    const paddedIntl = Intl.NumberFormat('fr', { minimumIntegerDigits: 2 })
    
    const delimiter = ':';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor(duration / 60) % 60;
    const seconds = duration % 60;
    const indexToPad = hours ? 0 : 1;
    const timeFormat =
      [hours, minutes, seconds]
      .map((val, i) => {
        return (val < 10 && i > indexToPad) ? paddedIntl.format(val) : nonPaddedIntl.format(val);
      })
      .filter((val, i) => {
        if (i === 0) {
            return !(val === '00' || val === '0');
        }
    
        return true;
      })
      .join(delimiter); // 4:32   
      
    return timeFormat;
}