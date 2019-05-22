var budgetController = (function() {

})();

var UIController = (function() {

})();

var controller = (function(budgetCtrl, UICtrl) {


    var ctrlAddItem = function(){
        //1.get the input data

        //2.add to the budget ctrl

        //3.add to the UI

        //4.calculate the budget

        //5. display the budget on the UI

    };


    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e){

        if(e.which=== 13){
            ctrlAddItem();
        }

    });


})(budgetController, UIController);