<template>
    <div id="container">
        <div id="output">
            <h1>Chat</h1>
            <p v-for="(text, index) in textOutput" :key="index">{{text}}</p>
        </div>
        <div id="input">
            <form>
                <input type="text" v-model="textInput" :placeholder="textInput" />
                <input type="submit" value="Send" v-on:click="submitText" />
            </form>
        </div>
    </div>
</template>

<script>
    import {io} from 'socket.io-client';

    export let socket = io('http://localhost:3000');

    export default {
        name: 'Chat',
        data: function () {
            return {
                textInput: null,
                textOutput: []
            }
        },
        methods: {
            submitText: function (event) {
                event.preventDefault();
                socket.emit('send', this.textInput);
            }
        },
        created: function () {
            socket.on('connect', () => {
                console.log('Connected!');
            });
            socket.on('receive', (text) => {
                this.textOutput.push(text);
                this.textInput = null;
            });
        }
    }
</script>

<style scoped>
    #container {
        text-align: left;
        display: flex;
        flex-direction: column;
        margin-left: 1vw;
        min-height: 100vh;
    }
    h1 {
        text-align: center;
    }
    #input {
        position: fixed;
        margin-top: 80vh;
    }
    input[type=text] {
        height: 20px;
        width: 40vw;
        border: 2px solid black;
        padding-left: 1em;
    }
    input[type=submit] {
        height: 20px;
        width: 5vw;
        border: 2px solid black;
        margin-right: 2vw;
    }

    input[type=submit]:focus {
        outline: none;
    }

</style>
