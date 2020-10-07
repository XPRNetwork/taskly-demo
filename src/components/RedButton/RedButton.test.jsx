import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RedButton from './RedButton';

const createTestProps = props => ({
  text: 'button text',
  ...props,
});

describe('RedButton component', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({});
  });

  it('renders without crashing', () => {
    shallow(<RedButton {...props} />);
  });

  it('matches the rendered snapshot', () => {
    const component = shallow(<RedButton {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

});
