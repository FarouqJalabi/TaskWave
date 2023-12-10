class ListsController < ApplicationController
  before_action :authorize_user!
  before_action :set_list, only: [:update, :destroy]
  def create
    @board = Board.find(params[:board_id])
    @list = @board.lists.create(list_params)
    redirect_to board_path(@board)
  end
  def update
    @list.update(list_params)
    redirect_to board_path(@list.board_id)
  end
  def destroy
    board_id = @list.board_id
    @list.destroy
    redirect_to board_path(board_id), status: :see_other
  end
  private
  def list_params
    params.require(:list).permit(:name)
  end
  def set_list
    @list = List.find(params[:id])
  end
  def authorize_user!
    authenticate_user!
    @board = Board.find(params[:board_id])
    unless @board.creator == current_user
      render "boards/show", status: :unauthorized
    end
  end
end
