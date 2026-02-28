exports.formatEtd = function (etd) {
  if (!etd) return ''
  
  return etd.replace(/(\d+)\s*day/gi, '$1 hari')
}