import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const getJson = async function (url) {
  try {
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`Error is :${data.message} ${data.status}`);
    return data.data;
  } catch (err) {
    throw err;
  }
};
export const sendJson = async function (url, recipeData) {
  try {
    const request = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData),
    });
    const res = await Promise.race([timeout(TIMEOUT_SEC), request]);
    const data = await res.json();
    if (!res.ok) throw new Error(`Error is :${data.message} ${data.status}`);
    return data.data;
  } catch (err) {
    throw err;
  }
};
