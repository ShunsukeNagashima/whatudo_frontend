export const formatDate = (date: Date, displayTime: boolean) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = (date.getDate()).toString().padStart(2, '0')
  let formatedDate = `${y}-${m}-${d}`

  if (displayTime) {
    const h = date.getHours()
    const min = date.getMinutes()
    const sec = date.getSeconds()

    formatedDate = `${formatedDate} ${h}:${min}:${sec}`
  }

  return formatedDate;
}

export const toDate = (dateString: string) => {
    const tmpArr = dateString.substring(0,10).split('-');
    const y = parseInt(tmpArr[0]);
    const m = parseInt(tmpArr[1]);
    const d = parseInt(tmpArr[2])

    const date = new Date(y,m - 1,d)
    return date
};