class ListsController < ApplicationController
  def create
    @board = Board.find(params[:board_id])
    @list = @board.lists.create(name: "New list")
    redirect_to board_path(@board)
  end
end
