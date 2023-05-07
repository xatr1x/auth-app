export default function mainMessage(name) {
  const result = `
    <h1>Hello, ${name} </h1><br>
    <a href='/logout'>Logout</a>
  `;

  return result;
}