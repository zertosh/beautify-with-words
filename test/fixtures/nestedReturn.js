function nestedReturn (val) {
  return (function(val) {
    return (function(val) {
      return (function(val) {
        return (function(val) {
          return (function(val) {
            return (function(val) {
              return (function(val) {
                return val;
              })(val);
            })(val);
          })(val);
        })(val);
      })(val);
    })(val);
  })(val);
}

module.exports = nestedReturn;
