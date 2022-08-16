'use strict';

let logoutButton = new LogoutButton();
let ratesBoard = new RatesBoard();
let moneyManager = new MoneyManager();
let favoritesWidget = new FavoritesWidget();

logoutButton.action = function () {
	ApiConnector.logout(response => {
		if (response.success) {
			location.reload();
		}
	});
}

ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

function getCurrencyExchangeRates() {
	ApiConnector.getStocks(response => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	})
}

getCurrencyExchangeRates();
setInterval(getCurrencyExchangeRates, 60000);

moneyManager.addMoneyCallback = function (data) {
	ApiConnector.addMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Баланс пополнен");
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
}

moneyManager.conversionMoneyCallback = function (data) {
	ApiConnector.convertMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Конвертация выполнена");
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
}

moneyManager.sendMoneyCallback = function (data) {
	ApiConnector.transferMoney(data, response => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(response.success, "Перевод выполнен");
		} else {
			moneyManager.setMessage(response.success, response.error);
		}
	});
}

ApiConnector.getFavorites(response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
});

favoritesWidget.addUserCallback = function (data) {
	ApiConnector.addUserToFavorites(data, response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, "Пользователь добавлен в избранное");
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	});
}

favoritesWidget.removeUserCallback = function (data) {
	ApiConnector.removeUserFromFavorites(data, response => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			moneyManager.updateUsersList(response.data);
			favoritesWidget.setMessage(response.success, "Пользователь удален из избранного");
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		}
	});
}
