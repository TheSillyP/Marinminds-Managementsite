import React from 'react'
// import { render } from '@testing-library/react'
import renderer from 'react-test-renderer'
import App from './'

test('App component renders OK', () => {
  const { toJSON } = renderer.create(<App />)
  const tree = toJSON()
  expect(tree).toMatchSnapshot()
})
