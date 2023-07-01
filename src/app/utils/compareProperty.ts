export const compareProperty = (obj1: any, obj2: any, propertyName: string): boolean => {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    throw new Error('Переданные значения не объекты');
  }

  if (!(propertyName in obj1) || !(propertyName in obj2)) {
    throw new Error('Переданное свойство не существует у одного из объектов.');
  }

  const value1 = obj1[propertyName];
  const value2 = obj2[propertyName];

  if (typeof value1 === 'object' && typeof value2 === 'object') {
    return JSON.stringify(value1) === JSON.stringify(value2);
  }

  return value1 === value2;
};
