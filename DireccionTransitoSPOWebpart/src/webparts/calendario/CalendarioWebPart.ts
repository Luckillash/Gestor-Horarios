import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'CalendarioWebPartStrings';
import Calendario from './components/Rutas';
import { getSP } from '../../pnp/pnpConfig'
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

export interface ICalendarioWebPartProps {

	description: string;

}

export default class CalendarioWebPart extends BaseClientSideWebPart<ICalendarioWebPartProps> {

	private _isDarkTheme: boolean = false;

	private _environmentMessage: string = '';

	public render(): void {

		const componentProps = {

			width: this.width,

			description: this.properties.description,
			
			isDarkTheme: this._isDarkTheme,
			
			environmentMessage: this._environmentMessage,
			
			hasTeamsContext: !!this.context.sdks.microsoftTeams,
			
			userDisplayName: this.context.pageContext.user.displayName,
		
			pageContext: this.context.pageContext

		}

		const element: React.ReactElement<IComponentProps> = React.createElement(Calendario, componentProps);

		const provider: React.ReactElement = React.createElement(Provider, { store } as any, element)

		ReactDom.render(provider, this.domElement);

	}

	protected async onInit(): Promise<void> {

		this._environmentMessage = this._getEnvironmentMessage();

		await super.onInit();

		getSP(this.context);

	}

	private _getEnvironmentMessage(): string {

		if (!!this.context.sdks.microsoftTeams) return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
	
		return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;

	}

	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
		
		if (!currentTheme) return;

		this._isDarkTheme = !!currentTheme.isInverted;

		const { semanticColors } = currentTheme;

		if (semanticColors) {

			this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
			
			this.domElement.style.setProperty('--link', semanticColors.link || null);
			
			this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
		
		}

	}

	protected onDispose(): void {

		ReactDom.unmountComponentAtNode(this.domElement);
			
	}

	protected get dataVersion(): Version {

		return Version.parse('1.0');

	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
	
		return {
			pages: [
				{
				header: {
					description: strings.PropertyPaneDescription
				},
				groups: [
					{
					groupName: strings.BasicGroupName,
					groupFields: [
						PropertyPaneTextField('description', {
						label: strings.DescriptionFieldLabel
						})
					]
					}
				]
				}
			]
		};

	}

}
