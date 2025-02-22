import React from 'react';
import { forEach } from 'lodash-es';

import badges from '@codesandbox/common/lib/utils/badges/patron-info';
import { Particle } from './elements';

const classNameRegex = /\shide/g;

function showElement(el: HTMLElement) {
  if (el.nodeName === 'svg') {
    el.setAttribute('class', el.className.baseVal.replace(classNameRegex, ''));
  } else {
    el.className = el.className.replace(classNameRegex, ''); // eslint-disable-line no-param-reassign
  }
}

function hideElement(el: HTMLElement) {
  if (el.nodeName === 'svg') {
    el.setAttribute('class', `${el.className.baseVal} hide`);
  } else {
    el.className += ' hide'; // eslint-disable-line no-param-reassign
  }
}

const createParticles = (amount: number, badge) =>
  Array(amount)
    .fill(0)
    .map((_, i) => (
      <Particle
        key={`${i}_${badge}`} // eslint-disable-line
        className={`${badge}-particle particle hide`}
        i={i}
        deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)}
        badge={badge}
      />
    ));

export class Particles extends React.Component {
  makeItRain = () => {
    const particleSelector = document.getElementsByClassName('particle');
    forEach(particleSelector, hideElement);

    requestAnimationFrame(() => {
      forEach(particleSelector, showElement);
    });
  };

  timeout: ?number;

  shouldComponentUpdate(nextProps) {
    if (nextProps.badge !== this.props.badge) {
      const particleSelector = document.getElementsByClassName(
        `${nextProps.badge}-particle`
      );

      forEach(particleSelector, hideElement);

      requestAnimationFrame(() => {
        forEach(particleSelector, showElement);
      });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        const allParticleSelector = document.getElementsByClassName('particle');
        forEach(allParticleSelector, hideElement);
      }, 700);
    }

    if (!this.props.makeItRain && nextProps.makeItRain) {
      this.makeItRain();
    }

    return false;
  }

  render() {
    return (
      <div>
        {Object.keys(badges).map(badge =>
          createParticles(badges[badge].particleCount, badge)
        )}
      </div>
    );
  }
}
