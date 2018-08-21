// INPUT JSON ARRAY EXAMPLE:
// export const CONVERSATION_INFO = [{
//     content: 'A: 中餐吃甚麼?',
//     type: 'question'
// },{
//     content: '涼麵',
//     type: 'answer',
//     next: [{
//         content: 'A: 好呀',
//         type: 'desc',
//         next: [{
//             content: 'A: 往哪走?',
//             type: 'question'
//         },{
//             content: '左邊',
//             type: 'answer',
//             next: [{
//                 content: 'okie',
//                 type: 'desc'
//             }]
//         },{
//             content: '右邊',
//             type: 'answer',
//             next: [{
//                 content: 'okie',
//                 type: 'desc'
//             }]
//         }]
//     }]
// },{
//     content: '雞腿飯',
//     type: 'answer',
//     next: [{
//         content: 'A: 也可以',
//         type: 'desc'
//     }]
// }]


// RULES:
// 1. The whole input is an JSON Array
// 2. 'next' should always be an JSON Array
// 3. If the layer is for description, where the type is set as 'desc', this layer only has single JSON. 
// 4. If the layer is for question and answer, this layer should have at least two type 'answer' JSON. (In this layer, type 'question' should be placed in front of type 'answer')
// 5. The type of the last layer should be 'desc'.
// 6. 'content' & 'type' is complusory / 'next' is optional => if 'next' doesn't exist, the component will consider it's the end of the conversation
// 7. All the functionalities are packed in a component. User only needs to intput the JSON Array
//    Usage: <Conversation info={JSON_Array} />



import React, {
    Component
} from 'react';
// import {
//     connect
// } from 'react-redux';

// import store from '../store/index.js';
// import {
//     linkToWallPapers,
//     cleanConversation
// } from '../actions/index';

// import './Conversation.css';

class Conversation extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        let cur = this.props.info;
        this.state = {
            cur: cur,
        }
    }

    handleClick(str, nextIndex = 0) {
        switch (str) {
            case 'next':
                this.goToNext(nextIndex);
                return;
            case 'return':
                // the return case should be rewritten
                // store.dispatch(cleanConversation());
                // store.dispatch(linkToWallPapers());
                return;
            default: 
                return;
        }
    }

    // This function receives the cur array and detect whether the it has next content to continue
    // Default assumption: 1. should end with type 'desc'
    //                     2. this final layer should only have one JSON 
    //                     3. next is undefined
    isThereNext(temp_json_array) {
        if(temp_json_array.length===1 && temp_json_array[0].next===undefined) return false;
        else return true;
    }

    // Replace next as cur
    goToNext(nextIndex) {
        let next = this.state.cur[nextIndex].next;
        this.setState({
            cur: next
        })
    }

    // Render current layer
    renderCur(cur) {
        let isNextEnd = this.isThereNext(cur);
        console.log(cur);
        return cur.map((item, move) => {
            return this.renderSingleCurItem(item, move, isNextEnd);
        })
    }

    // Render single JSON in the current layer
    renderSingleCurItem(displayItem, index, isNextEnd) {
        switch (displayItem.type) {
            case 'answer':
                return (
                    <button key={'redundant-key'+index} className='conversation-button' onClick={() => this.handleClick('next', index)}>{displayItem.content}</button>
                );
            case 'question':
                return (
                    <div className="question-description-box" key='redundant-key'>
                        <div className='question-description'>{displayItem.content}</div>
                    </div>
                );
            case 'desc':
                let direct_next_description;
                if (!isNextEnd){
                    direct_next_description = (<div className="conversation-next-button" onClick={() => this.handleClick('return')}>end, go back</div>);
                } 
                else direct_next_description = (<button className="conversation-next-button" onClick={() => this.handleClick('next', index)}>>>></button>);
                return (
                    <div className="normal-description-box" key='redundant-key'>
                        <div className='normal-description'>{displayItem.content}</div>
                        {direct_next_description}
                    </div>
                );
            default: 
                return;
        }


    }

    render() {
        let cur = this.renderCur(this.state.cur);
        return (
            <div className="conversation">
                <div className='conversation-box'>
                    <img className='pic-box' alt='rent-house-pic' 
                                src={require('../img/conversation-background.jpg')}
                    />
                    <div className='content-box'>
                        {
                            cur
                        }
                    </div>
                </div>
            </div>
        );
    }

}
export default Conversation;




















































// flattenArray(arr) {
//     let flattenArr = arr.reduce(function(prev, curr){
//         return prev.concat(curr);
//     });
//     return flattenArr;
// }

// reconstructJSONToSingleArr(cur) {
//     let tempList = [];
//     let finalList = [];
//     tempList = cur.map(item => {
//         item.index = 1;
//         return item;
//     })
//     while(tempList.length!==0){
//         let item = tempList.pop();
//         if(item.next!==undefined) {
//             item.next.map(nextItem => {
//                 nextItem.index = item.index + 1;
//                 tempList.push(nextItem);
//                 return;
//             })
//         } 
//         finalList.push(item);
//     }
//     finalList.sort(function(a, b){
//         return a.index - b.index;
//     })
//     // console.log('finalList', finalList);
//     // while(while item in the list have next){
//     //     unfold next
//     //     add layer index to the unfolded JSON chidren
//     //     insert JSON children into list
//     // } 
//     // sort the single array by layer index
// }