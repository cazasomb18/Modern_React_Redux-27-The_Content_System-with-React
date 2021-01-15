////////////////////////////////////////////////////////////////////////////////////////////////////
//The Content System

	//What is the context system?

	//Props System: gets data from a parent comp to a direct child comp

	//Context System: gets data from a parent's component to any nested child component
		//we can pass data from a parent to ANY NESTED CHILD


	//We could do this w/ CONTEXT
		//App
			//-buttonText->
				//Header
					//-buttonText->
						//Button
	//can pass data to a deeply nested child
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//An App with Context

	//App Overview
		//App>>			>>		>>>>language
			//UserCreate			^^
//								^^^		^^^
							//Field //Button

		//React Context alloww us to bypass UserCreate and pass it directly to nested children components
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//App Generation
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Selecting a Language

	//We're going to make this entire app with just component level state, no redux, no store
	//nothing fancy
		//set language in state:
		state = {language: 'english'};
		//render dutch and us flags:
			render(){
				return (
					<div className="ui container">
						<div>
							Select a language:
							<i className="flag us" onClick={() => this.onLanguageChange('english')} />
							<i className="flag nl" onClick={() => this.onLanguageChange('dutch')} />
						</div>
						{this.state.language}
					</div>
				);
			};
		//set up onLanguageChange method to change set language in state:
			onLanguageChange = language => {
				this.setState({ language });
			};




////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//A touch More Setup:
	//Putting together
		//UserCreate:
			import React from 'react';
			import Field from './Field';
			import Button from './Button';
			const UserCreate = () => {
				return (
					<div>
						<Field/>
						<Button/>
					</div>
				);
			};
			export default UserCreate;
		//Button:
			import React from 'react';
			class Button extends React.Component {
				render(){
					return <button className="ui primary">Submit</button>
				}
			}
			export default Button;
		//Field:
			import React from 'react';
			class Field extends React.Component {
				render(){
					return (
						<div className="ui field">
							<label>Name</label>
							<input/>
						</div>
					);
				}
			}
			export default Field;

	//Now render this in App.js:
		render(){
			return (
				<div className="ui container">
					<div>
						Select a language:
						<i className="flag us" onClick={() => this.onLanguageChange('english')} />
						<i className="flag nl" onClick={() => this.onLanguageChange('dutch')} />
					</div>
					<UserCreate/>
					{/*^^^here^^^*/}
				</div>
			);
		}
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Getting Data out of Context
	//Now we'll communicate our change in state.language down to the button component
		//-->using React Context

		//2 ways to get DATA INTO CONTEXT:
			//1 - set a default value when context object is created
			//2 - inside parent component we can create a provider component 
				//PROVIDER: can push info into the context object

		//2 ways to get DATA OUT OF CONTEXT in NESTED CHILD:
			//1 - reference 'this.context'
			//2 - Make use of Consumer component

		//Documentation is not clear on this b/c there are certain tims you want to use:
			//this.context
			//Consumer
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating Context Objects

	//Let's focus on creating a context object into our app
		//will commmunicate the language from <App/> to <Button/>

	//create src/contexts/LanguageContext.js:
		//LanguageContext.js: purpose is to create a context and export it,
			//in seperate file so that we can import it into only the component files we care about

		//LanguageContext.js:
			import React from 'react';
			export default React.createContext();
				//this is all we have to do to create a context

	//Now we'll get some info into our Context object by setting a default value:
		export default React.createContext('english');
			//default value is string 'english'

	//Connect it to button component first:
		import LanguageContext from '../context/LanguageContext';

		//We have to set up a contextType:
			//--> this will link <Botton/> to Context object
				//-->
		class Button extends React.Component {
			static contextType = LanguageContext;//this sets up a our contextType			
			render(){
				return <button className="ui button primary">Submit</button>
			}
		}
		Button.contextType = LanguageContext;//can also set it up this way, choose ONE
		export default Button;
			//static kw: adds a property to the class, so we could set it up like this also ^^^:

	//Component Button can now access 'this.context'

	//We can easily change the default value of context:
		//We can also use an valid js object: objects, arrays, etc.
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Consuming the Context value

	//so when you console.log(this.context) you'll notice that it's always visible
		//at present we have no way to change that value inside the context object
			//--> this is b/c we wired of a default value

	//set up <Button/> to alter string based on this.state.language toggling, button.js:
		import LanguageContext from '../context/LanguageContext';
		class Button extends React.Component {
			static contextType = LanguageContext;
			render(){
				const text = this.context === 'english' ? 'Submit' : 'Voorleggen';
				return <button className="ui button primary">{text}</button>
			}
		}
		//Now button component should update itself appropriately whenever language changes

	//let's do the same thing in Field.js:
		import LanguageContext from '../context/LanguageContext';
		class Field extends React.Component {
				static contextType = LanguageContext;
			render(){
				const text = this.context === 'english' ? 'Name' : 'Naam'
				return (
					<div className="ui field">
						<label>{text}</label>
						<input/>
					</div>
				);
			}
		}
		//GREAT! Next, we'll see how we can access the context object
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//The Context Provider

	//If we want to change value inside our context object:
		//need to create a comopnent that's source of infotmation(state):
			//<App/>

	//Need to communicate some context from the App to <Field/> and <Button/>:

	//App.js:
		//Since userCreate renders both Button and Field, it's this element that needs to be
		//wrapped in <LanguageContext.Provider></LanguageContext.Provider> tags:
			<LanguageContext.Provider value={this.state.language}>
				<UserCreate/>
			</LanguageContext.Provider>
				//value prop: pass information that you want to get into your context object
					//state.language
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Gotchas on Providers
	//LanguageContext.js:
		import React from 'react';
		const context = React.createContext('english');
		console.log(context);
		export default context;

	//When we look at this console.log we'll see that the Context{} has a prop of 'PROVIDER'
		//LanguageContext.Provider === created automatically by React

	//When we load this app:
		//App loads in browser
		//We create a context object w/ default value
		//<App/> gets rerendered, created Provider that wraps UserCreate //REPEATS ON DOWN WHEN FLAG CLICKED
		//Provider updates value of context object to 'this.state.language'
		//button and field reach into context object, see value from 'this.state.language'
		//Button and Field render appropriate text to screen

	//HERE'S THE GOTCHA:
		//Every SINGLE time you render an instance of that Provider, you're creating a brand new 
		//type of info that goes from parent down to children
		//When we do this:

			<LanguageContext.Provider value='english'>
				<UserCreate/>
			</LanguageContext.Provider>
				//hardcoded provider value does not cause UserCreate to rerender when flag clicked
					//seperate provider has it's own value of 'english'
						//no how many times we rerender this provider it'll always contain value='english'
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Accessing Data with Consumers

	//Dreating a consumer component
		//similar to Provider
			//Created for us automatically when we create a new context object
			//
	
	//Button:
		class Button extends React.Component {
			render(){
				const text = this.context === 'english' ? 'Submit' : 'Voorleggen';
				return (
					<button className="ui button primary">
						<LanguageContext.Consumer>
							{(value)=> }
						</LanguageContext.Consumer>
					</button>
				);
			}
		}
	//Any time we make use of a consumer to get a value out of the Context:
		//Bass in a single function as a child
		//that function will be called with whatever value is inside of Context
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Pulling from Multiple Contexts

	//We want the change the button and field colors 

	//SEt up 2nd context object
		//set up 2nd provider

	//since we're accessing multiple context objects
		//we'll have to access the consumer for both of them

	//Create new context file ColorContext.js:
		import React from 'react';
		export default React.createContext();

	//Now use ColorContext in Button js to affect the semantic ui button class name:
		class Button extends React.Component {
			renderSubmit = (value) => {
				return value = 'english' ? 'Submit' : 'Voorleggen';
			}
			renderButton = (color) => {
				return (
					<button className={`ui button ${color}`}>
						<LanguageContext.Consumer>
							{value =>this.renderSubmit(value)}
						</LanguageContext.Consumer>
					</button>
				);
			}
			render(){
				return (
					<ColorContext.Consumer>
						{(color) => this.renderButton(color)}
					</ColorContext.Consumer>
				);
			}
		}
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Exercise Overview: Consuming Context Values from Providers

	//communicate that information (ThemeContext)
		//wraps a provider around all the JSX
			//when user clicks on toggle Theme button:
				//toggle display
			//take this.state.themveValue pass down into theme context
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Coding Exercise 17: Creating and Consuming Content
	//SOLUTION:
	    render() {
	        return (
	            <ThemeContext.Provider value={this.state.theme}>
	                <div>
	                    <button onClick={()=>this.toggleTheme()}>Toggle Theme</button>
	                    <Content />
	                    
	                    <link
	                      rel="stylesheet"
	                      href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
	                    />
	                </div>
	            </ThemeContext.Provider>
	        );
    	}
		//you got it right on the first try:
////////////////////////////////////////////////////////////////////////////////////////////////////







