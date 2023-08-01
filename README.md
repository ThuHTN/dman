# DMan (Reactive Data Manipulation) Library

DMan (Data Manipulation) is a lightweight and easy-to-use library designed to simplify array manipulation. With DMan, you can easily perform various operations on arrays, making data manipulation a breeze in your projects.

## Features

DMan provides the following set of handy functions for array manipulation:

- **push**: Append elements to the end of the array.
- **remove**: Remove elements from the array based on various conditions.
- **addField**: Add a new field to each element of the array.
- **mutate**: Modify elements of the array based on custom transformations.

## Creating the DMan Instance
To start using the DMan library, create an instance of it using the dman() function:
```javascript
const res = dman();
```
## Subscribing to Data Changes
Subscribe to the changes in the manipulated data by using the subscribe function. This allows you to keep track of the changes and update your UI accordingly:

```javascript
import { ref } from 'vue';

const mockData = ref<MockData[]>([]);
const res = dman();

res.subscribe((val) => (mockData.value = val));
```

## Data Manipulation Operations
Once you have created the DMan instance and subscribed to data changes, you can perform various data manipulation operations on the array.

### Setting Initial Data
The res.set() function is used to set the initial data in the array. This function allows you to provide an array of objects, where each object represents an element with specific properties.
```javascript
res.set([{ label: "apple", price: 100, id: new Date().valueOf(), count: 10 }]);
```

### Appending Elements to the Array
The push function allows you to append new elements to the end of the array:
```javascript
res.push({
  label: 'donut',
  price: 500,
  id: new Date().valueOf(),
  count: 5,
}); // [{ label: "apple", price: 100, id: new Date().valueOf(), count: 10 }, { label: 'donut', price: 500, id: new Date().valueOf(), count: 5 }]
```

### Removing Elements from the Array
Remove elements from the array based on specific conditions using the remove function:
```javascript
res.remove({ count: 1, total: 500 });
```

### Adding a New Field to Each Element
You can easily add a new field to each element of the array using the addField function:
```javascript
res.addField((val: MockData) => ({
  ...val,
  total: val.price * val.count,
})); // [{ label: "apple", price: 100, id: new Date().valueOf(), count: 10, total: 1000 }, ...]
```

### Mutating Elements of the Array
The mutate function allows you to modify elements of the array based on a condition or set of conditions:
```javascript
res.mutate({ label: 'donut' }, { price: 700 })
```

## Contribution
Contributions to DMan are welcome! If you encounter any issues or have ideas for improvements, please feel free to create a pull request or submit an issue on the GitHub repository.


