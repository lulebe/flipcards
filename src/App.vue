<template>
  <router-view></router-view>
</template>

<script>
export default {
}
</script>

<style>
  * {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
  }
  html {
    font-family: sans-serif;
    font-size: 16px;
    color: #333;
  }
  .button {
    text-decoration: none;
    border-radius: 100px;
    border-width: 2px;
    border-style: solid;
    text-transform: uppercase;
    font-size: 1rem;
    padding: 8px 16px;
    cursor: pointer;
    background: #f3f3f3;
  }
  .button.img {
    height: 32px;
    width: 32px;
    padding: 2px 0;
  }
  .button:active {
    transform: scaleX(0.97);
  }

  .button:hover {
    background: #ddd;
  }
  .button.prim {
    color: #673ab7;
    background-color: #f3f3f3;
    border-color: #673ab7;
  }
  .button.prim:hover {
    color: #f3f3f3;
    background-color: #673ab7;
    border-color: #f3f3f3;
  }
  .button.acc {
    color: #00897b;
    background-color: #f3f3f3;
    border-color: #00897b;
  }
  .button.acc:hover {
    color: #f3f3f3;
    background-color: #00897b;
    border-color: #f3f3f3;
  }
  .button[disabled] {
    background: transparent;
    color: #999;
    border-color: #999;
    pointer-events: none;
  }
  a {
    color: #00897b;
    text-decoration: none;
  }
  a:not(.button):hover {
    text-decoration: underline;
  }
  input, textarea {
    font-size: 1rem;
    font-family: sans-serif;
    margin-bottom: 8px;
    outline: none;
    color: #333;
  }
  .input-group {
    display: inline-block;
    margin-bottom: 20px;
  }
  .input-group input, .input-group textarea {
    margin-bottom: 2px;
  }
  .input-group .error {
    font-size: 12px;
    line-height: 10px;
    display: none;
    color: #cc2222;
  }
  .input-group.invalid {
    margin-bottom: 8px;
  }
  .input-group.invalid label {
    color: #cc2222;
  }
  .input-group.invalid .error {
    display: block;
  }
  .input-group.invalid input[type=text], .input-group.invalid input[type=password], .input-group.invalid input[type=email], .input-group.invalid textarea {
    border-bottom: 2px solid #cc2222;
  }
  input[type=text], input[type=password], input[type=email], textarea {
    border: none;
    border-bottom: 2px solid grey;
    padding: 4px 8px;
    transition: 0.5s border-color ease-out;
    background: transparent;
  }
  textarea:focus, input[type=text]:focus, .input-group input[type=text]:focus, input[type=password]:focus, .input-group input[type=password]:focus, input[type=email]:focus, .input-group input[type=email]:focus {
    border-bottom: 2px solid #9C27B0;
  }
  input.full-width, .input-group.full-width, textarea.full-width {
    display: block;
    width: 100%;
  }

  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    cursor: default;
  }
</style>
