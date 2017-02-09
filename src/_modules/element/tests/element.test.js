'use strict';

import Element from '../element';

describe('Element View', function() {

  beforeEach(() => {
    this.element = new Element();
  });

  it('Should run a few assertions', () => {
    expect(this.element).toBeDefined();
  });

});
