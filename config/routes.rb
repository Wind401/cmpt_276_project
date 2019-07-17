Rails.application.routes.draw do

  root :to => "demo#sign_in"
  #root 'demo#sign_up'
  get 'demo/index'
  get 'demo/sign_up'
  get 'demo/sign_in'
  #match "demo/print", :to => "demo#print", :via =>:get

  #get ':controller(/:action(/:id))'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
