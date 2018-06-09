export const isValidSkillName = name => /^([A-Za-z]+ ?)+$/.test(name);

export const toValidSkillName = name =>
  name
    .toLowerCase()
    .split(' ')
    .map(t => t.charAt(0).toUpperCase() + t.substr(1))
    .join(' ');
