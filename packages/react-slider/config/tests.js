/** Jest test setup file. */

const { configure } = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const { resetIds } = require('@fluentui/utilities');

global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

// Configure enzyme.
configure({ adapter: new Adapter() });

resetIds();
