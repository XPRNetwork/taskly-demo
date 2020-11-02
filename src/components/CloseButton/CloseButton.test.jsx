import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CloseButton from './CloseButton';
import CloseIcon from './CloseIcon';

const createTestProps = props => ({
  handleOnClick: jest.fn(),
  ...props,
});

describe('CloseButton component', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({});
  });

  it('renders without crashing', () => {
    shallow(<CloseButton {...props} />);
  });

  it('matches the rendered snapshot', () => {
    const component = shallow(<CloseButton {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('tests click', () => {
    const mockCallBack = jest.fn();

    const component = shallow(<CloseButton handleOnClick={mockCallBack} />);
    component.find('div').simulate('click');
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});

describe('CloseIcon component', () => {
  it('renders without crashing', () => {
    shallow(<CloseIcon />);
  });

  it('matches the rendered snapshot', () => {
    const component = shallow(<CloseIcon />);
    expect(toJson(component)).toMatchSnapshot();
  });
});