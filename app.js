// budget controller
var budgetController = (function() {
    
    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        
        this.percentage = -1;
    };
    
    
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome> 0){
            this.percentage = Math.round(this.value/ totalIncome *100); 
        }else{
            this.percentage = -1;
        }    
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage
    };
    
    
    var Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems :{
            exp : [],
            inc : [],
        },
        totalItems :{
            exp: 0,
            inc: 0,
        },
        budget : 0,
        percentage : -1,
    };
    
    var calculateTotal = function(type){
        // store the sum 
        var sum =0;
        // loop through the array
        data.allItems[type].forEach(function(current){
            sum += current.value;  
        });
        
        data.totalItems[type] = sum;
    }
    
    return {
        //create a new methods which is addItem
        addItem : function(type, des, val) {
        
            var newItem, ID;
        
            // create new ID, ID is unique for every item id = last id + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
             }else{
                ID = 0;
             }
            
             // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
           
            data.allItems[type].push(newItem);
            
            return newItem;          
        }, 
        
        deleteItem : function(type, id){
            var ids, index;
            
            //loop all items into new array
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            // find index
            index = ids.indexOf(id);
            
            
            // remove by splice method
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function() {
            
            
            // calculate total income n exp
            calculateTotal ('exp');
            calculateTotal ('inc');
        
            // calculate budget income - expense
            data.budget = data.totalItems.inc - data.totalItems.exp;
            
            // calculate percentage of income spent
            if(data.totalItems.inc > 0){
                data.percentage = Math.round((data.totalItems.exp / data.totalItems.inc) *100);
            }else{
                data.percentage = -1;
            }
            
        },
        
        calculatePercentage: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totalItems.inc);
            });    
        },
        
        getPercentage: function(){
            
            var allPer = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPer;
           
        },
        
        getBudegt : function(){
            return {
                budget : data.budget,
                totalInc : data.totalItems.inc,
                totalExp : data.totalItems.exp,
                percentage : data.percentage,
            }
        },
        
        testing: function(){
            console.log(data);
        }
                    
    };
             
})();


// UI controller
var UIController = (function(){
    
    // dom string - connect with HTML class
    var DOMStrings ={
        inputType : '.add__type',
        inputDescription: ".add__description",
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel : '.item__percentage',
        dateLabel: '.budget__title--month',
    };
     
    //formatting numbers
    var formatNum = function(num,type) {
        var numSplit, int, dec;

        num = Math.abs(num);
        //decimal
        num = num.toFixed(2);
        numSplit = num.split ('.');
        int =numSplit[0];

        // , separating
        if (int.length >3){
            int= int.substr(0, int.length-3)+','+ int.substr(int.length-3, int.length);
        }
        dec = numSplit[1];

        // +/-
        return(type ==='exp'? '-' : '+') + ''+ int + '.'+ dec;            
    };

     
    return{
        
        getInput: function(){
            return{
                type : document.querySelector(DOMStrings.inputType).value,//will be inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };   
        }, 
        
        addListItem: function(obj, type){
            
            //create html string with placeholder text
            var html, newHtml, element;
            
            if (type === "inc"){
               element = DOMStrings.incomeContainer;
                
               html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            } else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%""><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
            }
          
            // replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNum(obj.value, type));
            
            // insert html to dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem : function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields : function(){
            var fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            var fieldsArray = Array.prototype.slice.call(fields);
            
            fieldsArray.forEach(function(current, index, array){
                current.value = '';
                
            });
            
            fieldsArray[0].focus();
        },
        
        //display budget
        displayBudget : function(obj){
            
            obj.budget > 0? type ='inc' :type ='exp';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNum(obj.budget, type); document.querySelector(DOMStrings.incomeLabel).textContent = formatNum(obj.totalInc,'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNum(obj.totalExp,'exp');  
            
            if(obj.percentage>0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage +'%'; 
            }else{
                 document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages : function(percentages){
            
            var fields = document.querySelectorAll(DOMStrings.expPercentageLabel);
            
            var nodeListForEach = function(list, callback) {
                
                for(var i=0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index]+'%';
                }else{
                    current.textContent = '---';
                }
                
            });
        },
       
        // date
        displayMonth : function(){
            var now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + '    ' + year;
        },
        
        
        // make DOMStrings public
        getDOMStrings: function(){
            return DOMStrings;
        }
    };
   
})();



// app controller

var controller = (function(budgetCtrl, UICtrl){
    
    var setUpEventListern = function(){
        
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
            
                 ctrlAddItem();
            }
        }); 
        
        // event delegation 
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    
    var updateBudget = function(){
        
        //calculate the budget
        budgetCtrl.calculateBudget();
        
        // return the budget
        var budget = budgetCtrl.getBudegt();
        
        //display budget on UI
        UICtrl.displayBudget(budget);
    };
    
    
    var updatePercentage = function(){
        // calculate the percentage
        budgetCtrl.calculatePercentage();
        // read percentage from budget controller
        var percentages = budgetCtrl.getPercentage();
        // update percentage on UI
        UICtrl.displayPercentages(percentages);
    };
    
    var ctrlAddItem = function (){
        var input, newItem;
        
        //get input data
        var input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value)) {
            
        //add item ti budget ctrl
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //add item to UI
        UICtrl.addListItem(newItem, input.type);
        
        // clear fields
        UICtrl.clearFields();
        
        // calculate and update budget
        updateBudget(); 
            
        // Update percentage
        updatePercentage();    
            
        }
      
        
    };
    
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        // target event - delete item
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            
            //split
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // delete item from data
            budgetCtrl.deleteItem(type, ID);
            
            // delete item from UI
            UICtrl.deleteListItem(itemID);
            
            // update and display new budget 
            updateBudget();
            
            // Update percentage
            updatePercentage();
        }
        
       
    }
    return {
        init: function(){
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget :0,
                totalInc : 0,
                totalExp :0,
                percentage: -1,
            });
            setUpEventListern();
        }
    }
    
})(budgetController, UIController);


controller.init();
