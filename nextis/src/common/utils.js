import { branch, renderComponent } from 'recompose';

export const renderWhileLoading = (component, propName = 'data') =>
  branch(
    props => props[propName] && props[propName].loading,
    renderComponent(component),
  );

export const isPublicPath = (path) => {
  return path.indexOf('/password/reset') !== -1
}
