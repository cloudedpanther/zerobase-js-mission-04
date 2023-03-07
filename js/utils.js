export const makeDOMWithProperties = (
  domType,
  propertyMap
) => {
  const dom = document.createElement(domType);
  Object.keys(propertyMap).forEach((key) => {
    dom[key] = propertyMap[key];
  });
  return dom;
};
